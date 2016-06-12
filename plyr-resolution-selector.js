(function(PlyrResSelector) {

  PlyrResSelector.use = function(player, after) {
    var container = player.media.parentElement.parentElement

    // Create our select component
    var qualitySelector = document.createElement('select')
    qualitySelector.dataset.plyr = 'resolution'
    qualitySelector.setAttribute('class', 'plyr__resolution')

    // Move to after desired dom element, defaults to after volume slider
    after = after || '.plyr__volume'
    var matchingTargets = container.querySelectorAll(after)
    var target = matchingTargets[matchingTargets.length-1]
    target.parentNode.insertBefore(qualitySelector, target.nextSibling)

    // Clear & re-add the <select>'s options once ready (on next tick)
    container.addEventListener('ready', function() {
      setTimeout(function() {
        clearSelectorOptions(qualitySelector)
        addSelectorOptions(qualitySelector)
      }, 1)
    })

    // Handle user picking different resolution
    qualitySelector.addEventListener('change', function() {
      // Map the selected option to its matching <source> element
      var selectedOption = this.childNodes[this.selectedIndex]
      var selectedRes = selectedOption.dataset.res

      var matchingIndex = player.media.childNodes.length
      for (var i = 0; i < player.media.childNodes.length; i++) {
        var srcRes = player.media.childNodes[i].getAttribute('res')
        if (srcRes == selectedRes)
          matchingIndex = i
      }

      // Re-orders the nodes so selected resolution is the first HTML5 source.
      player.media.insertBefore(player.media.childNodes[matchingIndex], player.media.childNodes[0])
      var currentTime = player.media.currentTime
      var isPaused = player.media.paused
      player.media.load()

      // Once we load the new data, play/pause it back from the position it was before.
      var loadSeeker = player.media.addEventListener('loadeddata', function() {
        player.seek(currentTime)
        player.media.removeEventListener('loadeddata', loadSeeker)
        isPaused ? player.media.pause() : player.media.play()
      })
    })
  }

  function addSelectorOptions(selector) {
    for (var i = 0; i < player.media.childNodes.length; i++) {
      var res = player.media.childNodes[i].getAttribute('res')
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
