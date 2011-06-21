# jquery.rating
## Turns a select input element into a rating control.

An easy to use rating control. It takes a normal select box, and turns it into a rating that your users can click on. The select box is preserved so you can still bind on change, get, and set the value in the rating control. The image is controlled with CSS and a simple gif, so you can make it look like anything you need.

	
    <select class="rating">
        <option value="0">Did not like</option>
        <option value="1">Ok</option>
        <option value="2" selected="selected">Liked</option>
        <option value="3">Loved!</option>
    </select>

    $(".rating").rating();


The select box is now replaced with the rating control. Each option you put in the select box is turned into a star, so you can easily have as many stars as you want. The value you set is the value that is returned for the selected star. The text becomes the title on the star.

You can turn the cancel button on and off, and change the value of the cancel button by passing it when you create the rating control. $(".rating").rating({showCancel: true, cancelValue: null,})

Available Options:

* showCancel: true : Should the cancel button be shown?
* cancelValue: null : If cancel button is shown, what should it's value be?
* startValue: null : If no property has the 'selected' attribute, what value should be displayed?
* cancelTitle: "Cancel" : The title for the cancel button.

