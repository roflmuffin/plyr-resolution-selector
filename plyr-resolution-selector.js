(function(PlyrResSelector) {

  // START FUNCTION PlyrResSelector.use - create and update functions
  PlyrResSelector.use = function(player, after) {
    
    // get container
    var container = player.getContainer();

    // Create our select div
    var qualitySelector = document.createElement('div');
    qualitySelector.dataset.plyr = 'resolution';
    qualitySelector.setAttribute('class', 'plyr__resolution');

    // Move to after desired dom element, defaults to after volume slider
    after = after || '.plyr__volume';
    var matchingTargets = container.querySelectorAll(after);
    var target = matchingTargets[matchingTargets.length-1];
    target.parentNode.insertBefore(qualitySelector, target.nextSibling);

    // set addSelectorData with callbacks
    var addSelectorData = {
      player: player,
      selector: qualitySelector,
      showOptions: function(){},
      hideOptions: function(){},
      updateResValue: function(){},
    };

    // START - add body click to hide when clicked on body
    jQuery('body').click(function (e) {
      addSelectorData.hideOptions();
    });
    // END - add body click to hide when clicked on body

    // START ADD - onlick to qualitySelector to Handle user clicking on selector and options
    qualitySelector.onclick = function (e) {

      // add stopPropagation to not bubble
      e.stopPropagation();

      // set currentRes and optionRes
      var currentRes = e.target.dataset.current;
      var optionRes = e.target.dataset.res;

      // START IF - optionRes
      if(optionRes){

        // run addSelectorData.hideOptions callback to hideOptions on click
        addSelectorData.hideOptions();

        // START IF - optionRes not equal to currentRes then update 
        if(optionRes != currentRes){
          changeResolution(optionRes);
          addSelectorData.updateResValue(e);
        };
        // END IF - optionRes not equal to currentRes then update

      }else{

        // run addSelectorData.showOptions callback to showOptions on click
        addSelectorData.showOptions();

      }
      // END IF - optionRes

    };
    // END ADD - onlick to qualitySelector to Handle user clicking on selector and options

    // START setTimeout - Attempt to add selectors as DOM could already be ready.
    setTimeout(function() {
      
      clearSelectorOptions(qualitySelector);
      addSelectorOptions(addSelectorData);

    }, 1);
    // END setTimeout - Attempt to add selectors as DOM could already be ready.

    // START addEventListener - to Clear & re-add the <select>'s options once ready (on next tick)
    container.addEventListener('ready', function() {
      setTimeout(function() {
        
        clearSelectorOptions(qualitySelector);
        addSelectorOptions(addSelectorData);

      }, 1);

    });
    // END addEventListener - to Clear & re-add the <select>'s options once ready (on next tick)

    // START FUNCTION - changeResolution to Handle user picking different resolution
    function changeResolution(dataRes) {
      
      // set selectedRes as dataRes passed
      var selectedRes = dataRes;

      // START LOOP - to get matchingIndex of source with res as selectedRes
      var matchingIndex = player.getMedia().children.length;

      for (var i = 0; i < player.getMedia().children.length; i++) {
        var srcRes = player.getMedia().children[i].getAttribute('res');
        
        // START IF - srcRes equals selectedRes set matchingIndex
        if (srcRes == selectedRes){
          matchingIndex = i;
        };
        // END IF - srcRes equals selectedRes set matchingIndex

      };
      // END LOOP - to get matchingIndex of source with res as selectedRes

      // START - Re-order the nodes so selected resolution is the first HTML5 source and get time and paused
      player.getMedia().insertBefore(player.getMedia().children[matchingIndex], player.getMedia().children[0]);
      var currentTime = player.getMedia().currentTime;
      var isPaused = player.getMedia().paused;
      player.getMedia().load();
      // END - Re-order the nodes so selected resolution is the first HTML5 source and get time and paused

      // START - Once we load the new data, play/pause it back from the position it was before.
      var loadSeeker = player.getMedia().addEventListener('loadeddata', function() {
        player.seek(currentTime);
        player.getMedia().removeEventListener('loadeddata', loadSeeker);
        isPaused ? player.getMedia().pause() : player.getMedia().play();
      });
      // END - Once we load the new data, play/pause it back from the position it was before.

    };
    // END FUNCTION - changeResolution to Handle user picking different resolution

  };
  // END FUNCTION PlyrResSelector.use - create and update functions

  // START FUNCTION - addSelectorOptions
  function addSelectorOptions(data) {
    
    // set player selector
    var player = data.player;
    var selector = data.selector;
    
    // START FUNCTION - updateResValue callback to updateValue of selector
    data.updateResValue = function(e){

      // set updateResValue
      var updateResValue = e.target.dataset.res; 

      // update selectorValue.innerHTML and selector.dataset.current 
      selectorValue.innerHTML = updateResValue;
      selector.dataset.current = updateResValue;

      // START LOOP - throught nodes and set active node and others inactive
      var parentNode = e.target.parentNode;

      for (var i = 0; i < parentNode.children.length; i++) {
        
        // set childDiv and childDataRes
        var childDiv = parentNode.children[i];
        var childDataRes = childDiv.dataset.res;

        // START IF - childDataRes equals updateResValue set active else inactive
        if(childDataRes == updateResValue){
          childDiv.setAttribute('class', 'plyr__resolution_option active');  
        }else{
          childDiv.setAttribute('class', 'plyr__resolution_option');  
        };
        // END IF - childDataRes equals updateResValue set active else inactive

      };
      // END LOOP - throught nodes and set active node and others inactive

    };
    // END FUNCTION - updateResValue callback to updateValue of selector

    // set sources
    var sources = player.getMedia().getElementsByTagName("source");

    // build  options_wrap and set style
    var options_wrap = document.createElement("div");
    options_wrap.setAttribute('class', 'plyr__resolution_options');

    // START FUNCTION - showOptions to showOptions
    data.showOptions = function (){
      options_wrap.className = 'plyr__resolution_options show';;
    };
    // END FUNCTION - showOptions to showOptions

    // START FUNCTION - hideOptions to hideOptions
    data.hideOptions = function (){
      options_wrap.className = 'plyr__resolution_options';;
    };
    // END FUNCTION - hideOptions to hideOptions

    // START LOOP - through sources and build options
    for (var i = 0; i < sources.length; i++) {
      
      // set res as source res
      var res = sources[i].getAttribute('res');

      // START IF - res not null create option
      if (res != null) {
        
        // build option, set text and style
        var option = document.createElement("div");
        option.setAttribute('class', 'plyr__resolution_option');
        option.innerHTML = res;
        option.dataset.res = res;
        options_wrap.prepend(option);

        // START IF - first element then set active
        if(i == 0){
          
          // set option active
          option.setAttribute('class', 'plyr__resolution_option active');

          // build selectorValue 
          var selectorValue = document.createElement("span");        
          selectorValue.innerHTML = res;
          selector.appendChild(selectorValue);
          selector.dataset.current = res;

        };
        // END IF - first element then set active

      };
      // END IF - res not null create option

    };
    // END LOOP - through sources and build options

    // add options_wrap to selector
    selector.appendChild(options_wrap);

  };
  // END FUNCTION - addSelectorOptions

  // START FUNCTION - clearSelectorOptions
  function clearSelectorOptions(selector) {
    selector.innerHTML = "";
  };
  // END FUNCTION - clearSelectorOptions

})(window.PlyrResSelector = window.PlyrResSelector || {});