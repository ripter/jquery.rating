//
// rating Plugin
// By Chris Richards
// Last Update: 6/21/2011
// Turns a select box into a star rating control.
//
//
// Updated by Dovy Paukstys 21 Sept. 2011
// Fixed the click to clear out stars not working with newer jquery, but may not have ever worked.
// Also fixed it so on a new page load it will properly populate the stars as they should be.
//
//

//Keeps '$' pointing to the jQuery version
(function ($) { 
	
	$.fn.rating = function(options)
	{
		//
		// Settings
		//
		var settings =
		{
			showCancel: true,
			cancelValue: null,
			cancelTitle: "Cancel",
			startValue: null,
			showTarget: false,
			disabled: false
		};

        //
        // Methods
        //
        var methods = {
           hoverOver: function(evt)
			{
				var elm = $(evt.target);
				
				//Are we over the Cancel or the star?
				if( elm.hasClass("ui-rating-cancel") )
				{
					elm.addClass("ui-rating-cancel-full");
				} 
				else 
				{
					elm.prevAll().andSelf()
						.not(".ui-rating-cancel")
						.addClass("ui-rating-hover");
				}
			},
			hoverOut: function(evt)
			{
				var elm = $(evt.target);
				//Are we over the Cancel or the star?
				if( elm.hasClass("ui-rating-cancel") )
				{
					elm.addClass("ui-rating-cancel-empty")
						.removeClass("ui-rating-cancel-full");
				}
				else
				{
					elm.prevAll().andSelf()
						.not(".ui-rating-cancel")
						.removeClass("ui-rating-hover");
				}
			},
			click: function(evt)
			{
				var elm = $(evt.target);
				var value = settings.cancelValue;
				//Are we over the Cancel or the star?
				elm.parents(".content-box-content:first").removeClass('formerror');
				if( elm.hasClass("ui-rating-cancel") ) {
                    methods.empty(elm, elm.parent());
				}
				else
				{
					//Set us, and the stars before us as full
					elm.closest(".ui-rating-star").prevAll().andSelf()
						.not(".ui-rating-cancel")
						.prop("className", "ui-rating-star ui-rating-full");
					//Set the stars after us as empty 
					elm.closest(".ui-rating-star").nextAll()
						.not(".ui-rating-cancel")
						.prop("className", "ui-rating-star ui-rating-empty");
					//Uncheck the cancel
					elm.siblings(".ui-rating-cancel")
						.prop("className", "ui-rating-cancel ui-rating-cancel-empty");
					//Use our value
					value = elm.attr("value");
				}
				
				//Set the select box to the new value
				if( !evt.data.hasChanged )
				{
					$(evt.data.selectBox).val( value ).trigger("change");
					
					// set uiVlaue
					if (true == settings.showTarget) {
						uiValue = $(evt.data.selectBox).find("option:selected").text();
						targetId = "#" + evt.data.selectBox.attr("name");
						$(targetId).text(uiValue);
				    }
				}
			},
			change: function(evt)
			{
				var value =  $(this).val();
				if (value == settings.cancelValue){
					methods.empty(evt.data.container.find('ui-rating-cancel'),evt.data.container);
				}else{
					methods.setValue(value, evt.data.container, evt.data.selectBox);
				}
			},
			setValue: function(value, container, selectBox)
			{
				//Set a new target and let the method know the select has already changed.
				var evt = {"target": null, "data": {}};

				evt.target = $(".ui-rating-star[value="+ value +"]", container);				
				evt.data.selectBox = selectBox;
				evt.data.hasChanged = true;
				methods.click(evt);
			},
			empty: function(elm, parent)
			{
				// Fix to remove all stars
				parent.find('.ui-rating-star').removeClass('ui-rating-full');
				parent.find('.ui-rating-star').addClass('ui-rating-empty');				
				//Clear all of the stars
				elm.prop("className", "ui-rating-cancel ui-rating-cancel-empty")
					.nextAll().prop("className", "ui-rating-star ui-rating-empty");
			}
 
        };

        //
		// Process the matched elements
		//
		return this.each(function() {
            var self = $(this),
                elm,
                val;

            // we only want to process single select
            if ('select-one' !== this.type) { return; }
            // don't process the same control more than once
            if (self.prop('hasProcessed')) { return; }

            // if options exist, merge with our settings
            if (options) { $.extend( settings, options); }

            // hide the select box because we are going to replace it with our control
            self.hide();
            // mark the element so we don't process it more than once.
            self.prop('hasProcessed', true);
            
            //
            // create the new HTML element
            // 
            // create a div and add it after the select box
            elm = $("<div/>").prop({
                title: this.title,  // if there was a title, preserve it.
                className: "ui-rating"
            }).insertAfter( self );
			
			// create the p to hold selected value
		   if (true == settings.showTarget) {
				uiValue = $("<p/>").prop({
		         	id: this.name,  // set id to the input name attribute
		         	className: "ui-selected-value"
		    	}).insertAfter( elm );
			}
            // create all of the stars
            $('option', self).each(function() {
                // only convert options with a value
				if(this.value!="")
				{
                    $("<a/>").prop({
                        className: "ui-rating-star ui-rating-empty",
                        title: $(this).text(),   // perserve the option text as a title.
                        value: this.value        // perserve the value.
                    }).appendTo(elm);
				}    
            });
            // create the cancel
            if (true == settings.showCancel) {
                $("<a/>").prop({
					className: "ui-rating-cancel ui-rating-cancel-empty",
					title: settings.cancelTitle
				}).appendTo(elm);
            }
            // perserve the selected value
            //
            if ( 0 !==  $('option:selected', self).size() ) {
                //methods.setValue(                
                methods.setValue( self.val(), elm, self );
            } else {
                //Use a start value if we have it, otherwise use the cancel value.
				val = null !== settings.startValue ? settings.startValue : settings.cancelValue;
				methods.setValue( val, elm, self );
				//Make sure the selectbox knows our desision
				self.val(val);
            }
            
            //Should we do any binding?
			if( true !== settings.disabled && self.prop("disabled") !== true )
			{	
			    //Bind our events to the container
			    $(elm).bind("mouseover", methods.hoverOver)
				    .bind("mouseout", methods.hoverOut)
				    .bind("click",{"selectBox": self}, methods.click);
			}	

            //Update the stars if the selectbox value changes.
			self.bind("change", {"selectBox": self, "container": elm},  methods.change);

        });
		
	};

})(jQuery);
