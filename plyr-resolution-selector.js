(function(PlyrResSelector) {

  PlyrResSelector.use = function(player, after) {
    var container = player.getContainer()

    // Create our select component
    var qualitySelector = document.createElement('select')
    qualitySelector.dataset.plyr = 'resolution'
    qualitySelector.setAttribute('class', 'plyr__resolution')

    // Move to after desired dom element, defaults to after volume slider
    after = after || '.plyr__volume'
    var matchingTargets = container.querySelectorAll(after)
    var target = matchingTargets[matchingTargets.length-1]
    target.parentNode.insertBefore(qualitySelector, target.nextSibling)

    // Attempt to add selectors as DOM could already be ready.
    setTimeout(function() {
      clearSelectorOptions(qualitySelector)
      addSelectorOptions(player, qualitySelector)
    }, 1)

    // Clear & re-add the <select>'s options once ready (on next tick)
    container.addEventListener('ready', function() {
      setTimeout(function() {
        clearSelectorOptions(qualitySelector)
        addSelectorOptions(player, qualitySelector)
      }, 1)
    })

    // Handle user picking different resolution
    qualitySelector.addEventListener('change', function() {
      // Map the selected option to its matching <source> element
      var selectedOption = this.children[this.selectedIndex]
      var selectedRes = selectedOption.dataset.res

      var matchingIndex = player.getMedia().children.length
      for (var i = 0; i < player.getMedia().children.length; i++) {
        var srcRes = player.getMedia().children[i].getAttribute('res')
        if (srcRes == selectedRes)
          matchingIndex = i
      }

      // Re-orders the nodes so selected resolution is the first HTML5 source.
      player.getMedia().insertBefore(player.getMedia().children[matchingIndex], player.getMedia().children[0])
      var currentTime = player.getMedia().currentTime
      var isPaused = player.getMedia().paused
      player.getMedia().load()

      // Once we load the new data, play/pause it back from the position it was before.
      var loadSeeker = player.getMedia().addEventListener('loadeddata', function() {
        player.seek(currentTime)
        player.getMedia().removeEventListener('loadeddata', loadSeeker)
        isPaused ? player.getMedia().pause() : player.getMedia().play()
      })
    })
  }

  function addSelectorOptions(player, selector) {
    var sources = player.getMedia().getElementsByTagName("source")
    for (var i = 0; i < sources.length; i++) {
      var res = sources[i].getAttribute('res')
      if (res != null) {
        var option = document.createElement("option")
        option.innerHTML = res
        option.dataset.res = res
        selector.appendChild(option)
      }
    }
  }

  function clearSelectorOptions(selector) {
    selector.innerHTML = ""
  }

})(window.PlyrResSelector = window.PlyrResSelector || {})
