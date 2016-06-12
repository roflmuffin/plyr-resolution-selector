# Plyr Resolution Selector
Adds a resolution selector control to the Plyr HTML5 video player to allow users to switch between video qualities.

<br><br>
![Plyr Resolution Switcher](https://cloud.githubusercontent.com/assets/4160975/15988669/caa50800-309c-11e6-9cea-6d01d518fc4e.png)

##Install
You can use bower (`bower install plyr-resolution-selector`), npm (`npm install plyr-resolution-selector`), or download the source from this repo. This plugin was built against version 1.6.20 and is untested against previous versions.

##Usage
Add an extra attribute to your `<source>` elements.
```html
<video>
	<source res="480" src="..." type="..." />
	<source res="240" src="..." type="..." />
</video>
```

or programmatically 


Enable the plugin once the `Plyr` has been setup.

```js
var player = plyr.setup()[0]
PlyrResSelector.use(player)
```

By default, the `<select>` element will be inserted after the volume bar, but you can insert it after another control as such:

```js
PlyrResSelector.use(player, 'plyr__progress')
```
or even
```js
PlyrResSelector.use(player, '[data-plyr="mute"]')
```

##Styling the select
 The plugin does not include any styling apart from changing the font color & margin, so the select will appear in the browsers default style. The element has the classname `plyr__resolution` in a similar fashion to other Plyr control, so simply target this classname to restyle.
