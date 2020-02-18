// ==UserScript==
// @name         IdleLoops Predictor 4_za_4s
// @namespace    https://github.com/4za4s/
// @version      0.0
// @description  Predicts the amount of resources spent and gained by each action in the action list.
// @author       4_za_4s
// @match        *://omsi6.github.io/loops/*
// @grant        none
// ==/UserScript==

const Predictor = {
    predict: () => {
		//-------------------------------------------------------------------------------------------
		
		

		//---------------------------------------------------------------------------------------------------------------------
	},
	
	
    run: () => {
        if (!view._updateNextActions) {
            view._updateNextActions = view.updateNextActions;
		}
		
        // Hook `updateNextActions` with the predictor's update function
        view.updateNextActions = () => {
            view._updateNextActions();
            Predictor.predict();
		};
		
    }
}

setTimeout(() => document.readyState == 'complete' && Predictor.run(), 2000);