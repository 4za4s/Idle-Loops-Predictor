// ==UserScript==
// @name         IdleLoops Predictor 4_za_4s
// @namespace    https://github.com/4za4s/
// @version      0.2.2
// @description  Predicts the amount of resources spent and gained by each action in the action list.
// @author       4_za_4s
// @match        *://omsi6.github.io/loops/*
// @grant        none
// ==/UserScript==

const Predictor = {
    predict: () => {
		//-------------------------------------------------------------------------------------------
		tempPredictions = []
		pTown = copyArray(towns)
		pCurTown = 0
		pStats = copyArray(stats)
		totalMana = 250
		manaUsed = 0
	    	pStop = false
		pResources = {armor: 0, artifacts: 0, blood: 0, glasses: false, gold: 0, herbs: 0, hide: 0, loopingPotion: false, pickaxe: false, potions: 0, reputation: 0, supplies: false, teamMembers: 0}
		for(stat of Object.entries(pStats)){
			stat[1].exp = 0
		}
		function pFormatter(num, digits){
			if(num < 0){num *= -1}
			nFormatter(num, digits)
		}
		function pManaCost(pActionStats){
			pNewCost = 0
			for (mStatName of Object.entries(pActionStats)) {
				pNewCost += mStatName[1] / (1 + getLevelFromExp(pStats[mStatName[0]].exp) / 100)
			}
			return Math.ceil(tAction.manaCost() * pNewCost - 0.000001)
		}
		
		function pExpGain(stat){
			tExp = tAction.expMult * (tAction.manaCost()/pManaCost(tAction.stats))
			return tAction.stats[stat] * tExp * calcSoulstoneMult(pStats[stat].soulstone) * calcTalentMult(getLevelFromTalent(pStats[stat].talent))
		}
		
		function pTalentGain(pActionStats){
			for(tStatName of Object.entries(pActionStats)){
				pAction.stats[tStatName[0]]["Exp Gain"] += (pExpGain(tStatName[0]))*pManaCost(tAction.stats)
				pAction.stats[tStatName[0]]["Talent Gain"] += (pExpGain(tStatName[0])/100)*pManaCost(tAction.stats)
				tempExpGain = pExpGain(tStatName[0])*pManaCost(tAction.stats)
				pStats[tStatName[0]].exp += tempExpGain
				pStats[tStatName[0]].talent += (tempExpGain/100)
			}
		}
		
		function rewardFinish(varName, rewardRatio, reward) {
			const searchToggler = document.getElementById("searchToggler" + varName);
			tempGain = 0
			if (pTown[pCurTown]["total" + varName] - pTown[pCurTown]["checked" + varName] > 0 && ((searchToggler && !searchToggler.checked) || pTown[pCurTown]["good" + varName] <= 0)) {
				pTown[pCurTown]["checked" + varName]++;
				if (pTown[pCurTown]["checked" + varName] % rewardRatio === 0) {
					tempGain = reward
					pTown[pCurTown]["good" + varName]++;
				}
				} else if (pTown[pCurTown]["good" + varName] > 0) {
				pTown[pCurTown]["good" + varName]--;
				tempGain = reward
			} 
		}
		function progressFinish(pVarName, pProgressExp){
			//need to add code
		}
		
		function getPrcToNextLevel(stat) {
			expOfCurLevel = getExpOfLevel(getLevel(stat));
			curLevelProgress = stats[stat].exp - expOfCurLevel;
			nextLevelNeeds = getExpOfLevel(getLevel(stat) + 1) - expOfCurLevel;
			return Math.floor(curLevelProgress / nextLevelNeeds * 100 * 10) / 10;
		}
		
		for(i = 0; i < actions.next.length; i++){
			if(pStop){ break }
			if((actions.next[i].disabled == false) && (actions.next[i].loops > 0)){
				tAction = translateClassNames(actions.next[i].name)
				if(tAction.townNum == pCurTown){
					pAction = {}
					pAction["name"] = tAction.name
					pAction.mana = {}
					pAction.gold = {}
					pAction.resources = pResources
					pAction.stats = {}
					pAction.mana["mana cost"] = 0
					pAction.mana["mana gain"] = 0
					pAction.mana["mana Netgain"] = 0
					pAction.mana["total mana"] = totalMana
					pAction.gold["gold gain"] = 0
					pAction.gold["total gold"] = pResources.gold
					pAction["loops"] = 0
					
					for(stat of Object.entries(pStats)){
						pAction.stats[stat[0]] = {}
						pAction.stats[stat[0]]["Exp Gain"] = 0
						pAction.stats[stat[0]]["Talent Gain"] = 0
					}
					
					for(l = 0; l < actions.next[i].loops; l++){
						if(pStop){ break }
						if((i == actions.next.length - 1) && document.querySelector("#repeatLastAction").checked) { l = -1 }
						pAction.mana["mana cost"] += pManaCost(tAction.stats)
						if((totalMana - pManaCost(tAction.stats)) < 0){ break }
						manaUsed += pManaCost(tAction.stats)
						pTalentGain(tAction.stats)
						//----------------------------------------------------------
						if(pAction.name == "Wander"){
							//need to add code
						}
						if(pAction.name == "Smash Pots"){
							pAction[tAction.varName] = {}
							rewardFinish(tAction.varName, 10, actionsWithGoldCost[0].goldCost())
							pAction[tAction.varName][tAction.varName + " to check"] = pTown[pCurTown]["total" + tAction.varName] - pTown[pCurTown]["checked" + tAction.varName]
							pAction[tAction.varName][tAction.varName + " with mana"] = Math.floor(pTown[pCurTown]["checked" + tAction.varName]/10)
							pAction[tAction.varName][tAction.varName + " left"] = pTown[pCurTown]["good" + tAction.varName]
							pAction.mana["mana gain"] += tempGain
							
						}
						if (pAction.name === "Pick Locks") {
							pAction[tAction.varName] = {}
							rewardFinish(tAction.varName, 10, actionsWithGoldCost[1].goldCost())
							pAction[tAction.varName][tAction.varName + " to check"] = pTown[pCurTown]["total" + tAction.varName] - pTown[pCurTown]["checked" + tAction.varName]
							pAction[tAction.varName][tAction.varName + " with mana"] = Math.floor(pTown[pCurTown]["checked" + tAction.varName]/10)
							pAction[tAction.varName][tAction.varName + " left"] = pTown[pCurTown]["good" + tAction.varName]
							pAction.gold["gold gain"] += tempGain
						}
						if (pAction.name === "Buy Glasses") {
							pResources.glasses = true
							pResources.gold += -10
						}
						if (pAction.name === "Buy Mana") {
							pAction.mana["mana gain"] = pResources.gold * 50
							pResources.gold = 0
						}
						if (pAction.name === "Meet People") {
							
						}
						if (pAction.name === "Train Strength") {
							
						}
						if (pAction.name === "Short Quest") {
							pAction[tAction.varName] = {}
							rewardFinish(tAction.varName, 5, actionsWithGoldCost[2].goldCost())
							pAction[tAction.varName][tAction.varName + " to check"] = pTown[pCurTown]["total" + tAction.varName] - pTown[pCurTown]["checked" + tAction.varName]
							pAction[tAction.varName][tAction.varName + " with mana"] = Math.floor(pTown[pCurTown]["checked" + tAction.varName]/10)
							pAction[tAction.varName][tAction.varName + " left"] = pTown[pCurTown]["good" + tAction.varName]
							pAction.gold["gold gain"] += tempGain
						}
						if (pAction.name === "Investigate") {
							
						}
						if (pAction.name === "Long Quest") {
							pAction[tAction.varName] = {}
							rewardFinish(tAction.varName, 5, actionsWithGoldCost[3].goldCost())
							pAction[tAction.varName][tAction.varName + " to check"] = pTown[pCurTown]["total" + tAction.varName] - pTown[pCurTown]["checked" + tAction.varName]
							pAction[tAction.varName][tAction.varName + " with mana"] = Math.floor(pTown[pCurTown]["checked" + tAction.varName]/10)
							pAction[tAction.varName][tAction.varName + " left"] = pTown[pCurTown]["good" + tAction.varName]
							pAction.gold["gold gain"] += tempGain
						}
						if (pAction.name === "Warrior Lessons") {
							
						}
						if (pAction.name === "Mage Lessons") {
							
						}
						if (pAction.name === "Throw Party") {
							
						}
						if (pAction.name === "Heal The Sick") {
							
						}
						if (pAction.name === "Fight Monsters") {
							
						}
						if (pAction.name === "Small Dungeon") {
							
						}
						if (pAction.name === "Buy Supplies") {
							
						}
						if (pAction.name === "Haggle") {
							
						}
						if (pAction.name === "Start Journey") {
							
						}
						if (pAction.name === "Open Rift") {
							
						}
						// town 2
						if (pAction.name === "Explore Forest") {
							
						}
						if (pAction.name === "Wild Mana") {
							pAction[tAction.varName] = {}
							rewardFinish(tAction.varName, 10, actionsWithGoldCost[4].goldCost())
							pAction[tAction.varName][tAction.varName + " to check"] = pTown[pCurTown]["total" + tAction.varName] - pTown[pCurTown]["checked" + tAction.varName]
							pAction[tAction.varName][tAction.varName + " with mana"] = Math.floor(pTown[pCurTown]["checked" + tAction.varName]/10)
							pAction[tAction.varName][tAction.varName + " left"] = pTown[pCurTown]["good" + tAction.varName]
							pAction.mana["mana gain"] += tempGain
						}
						if (pAction.name === "Gather Herbs") {
							pAction[tAction.varName] = {}
							rewardFinish(tAction.varName, 10, () => {return 1})
							pAction[tAction.varName][tAction.varName + " to check"] = pTown[pCurTown]["total" + tAction.varName] - pTown[pCurTown]["checked" + tAction.varName]
							pAction[tAction.varName][tAction.varName + " with mana"] = Math.floor(pTown[pCurTown]["checked" + tAction.varName]/10)
							pAction[tAction.varName][tAction.varName + " left"] = pTown[pCurTown]["good" + tAction.varName]
							pResources["herbs"] += tempGain
						}
						if (pAction.name === "Hunt") {
							pAction[tAction.varName] = {}
							rewardFinish(tAction.varName, 10, () => {return 1})
							pAction[tAction.varName][tAction.varName + " to check"] = pTown[pCurTown]["total" + tAction.varName] - pTown[pCurTown]["checked" + tAction.varName]
							pAction[tAction.varName][tAction.varName + " with mana"] = Math.floor(pTown[pCurTown]["checked" + tAction.varName]/10)
							pAction[tAction.varName][tAction.varName + " left"] = pTown[pCurTown]["good" + tAction.varName]
							pResources["hide"] += tempGain
						}
						if (pAction.name === "Sit By Waterfall") {
							
						}
						if (pAction.name === "Old Shortcut") {
							
						}
						if (pAction.name === "Talk To Hermit") {
							
						}
						if (pAction.name === "Practical Magic") {
							
						}
						if (pAction.name === "Learn Alchemy") {
							
						}
						if (pAction.name === "Brew Potions") {
							
						}
						if (pAction.name === "Train Dexterity") {
							
						}
						if (pAction.name === "Train Speed") {
							
						}
						if (pAction.name === "Follow Flowers") {
							
						}
						if (pAction.name === "Bird Watching") {
							
						}
						if (pAction.name === "Clear Thicket") {
							
						}
						if (pAction.name === "Talk To Witch") {
							
						}
						if (pAction.name === "Dark Magic") {
							
						}
						if (pAction.name === "Dark Ritual") {
							
						}
						if (pAction.name === "Continue On") {
							
						}
						// town 3
						if (pAction.name === "Explore City") {
							
						}
						if (pAction.name === "Gamble") {
							
						}
						if (pAction.name === "Get Drunk") {
							
						}
						if (pAction.name === "Purchase Mana") {
							
						}
						if (pAction.name === "Sell Potions") {
							
						}
						if (pAction.name === "Read Books") {
							
						}
						if (pAction.name === "Adventure Guild") {
							
						}
						if (pAction.name === "Gather Team") {
							
						}
						if (pAction.name === "Large Dungeon") {
							
						}
						if (pAction.name === "Crafting Guild") {
							
						}
						if (pAction.name === "Craft Armor") {
							
						}
						if (pAction.name === "Apprentice") {
							
						}
						if (pAction.name === "Mason") {
							
						}
						if (pAction.name === "Architect") {
							
						}
						if (pAction.name === "Buy Pickaxe") {
							
						}
						if (pAction.name === "Start Trek") {
							
						}
						// town 4 
						if (pAction.name === "Climb Mountain") {
							
						}
						if (pAction.name === "Mana Geyser") {
							pAction[tAction.varName] = {}
							rewardFinish(tAction.varName, 10, () => {return 5000})
							pAction[tAction.varName][tAction.varName + " to check"] = pTown[pCurTown]["total" + tAction.varName] - pTown[pCurTown]["checked" + tAction.varName]
							pAction[tAction.varName][tAction.varName + " with mana"] = Math.floor(pTown[pCurTown]["checked" + tAction.varName]/10)
							pAction[tAction.varName][tAction.varName + " left"] = pTown[pCurTown]["good" + tAction.varName]
							pAction.mana["mana gain"] += tempGain
						}
						if (pAction.name === "Decipher Runes") {
							
						}
						if (pAction.name === "Chronomancy") {
							
						}
						if (pAction.name === "Looping Potion") {
							
						}
						if (pAction.name === "Pyromancy") {
							
						}
						if (pAction.name === "Explore Cavern") {
							
						}
						if (pAction.name === "Mine Soulstones") {
							
						}
						if (pAction.name === "Hunt Trolls") {
							
						}
						if (pAction.name === "Check Walls") {
							
						}
						if (pAction.name === "Take Artifacts") {
							
						}
						if (pAction.name === "Imbue Mind") {
							
						}
						if (pAction.name === "Face Judgement") {
							
						}
						// town 5
						if (pAction.name === "Look Around") {
							
						}
						if (pAction.name === "Great Feast") {
							
						}
						if (pAction.name === "Fall From Grace") {
							
						}
						// town 6
						if (pAction.name === "Survey Area") {
							
						}
						//----------------------------------------------------------
						pAction.mana["mana used"] = manaUsed
						pAction.mana["mana Netgain"] = pAction.mana["mana gain"] - pAction.mana["mana cost"]
						totalMana = pAction.mana["total mana"] + pAction.mana["mana Netgain"]
						pResources.gold += pAction.gold["gold gain"]
						pAction.gold["total gold"] = pResources.gold
						
						for(stat of Object.entries(pStats)){
							stat[1]["Talent Level"] = getLevelFromTalent(pStats[stat[0]].talent)
							stat[1]["Exp Level"] = getLevelFromExp(pStats[stat[0]].exp)
						}
						pAction["loops"] += 1
						if(totalMana < 0){ 
							pStop = true
							break
						}
					}
				}
				if(pStop == true){ break }
				pAction.mana["total mana"] = totalMana
				tempPredictions.push(pAction)
			}
			if(pStop == true){ break }
		}
		tempPredictions["final"] = []
		tempPredictions["final"]["stats"] = pStats
		tempPredictions["final"]["mana Used"] = manaUsed
		predictions = tempPredictions
		console.log(predictions)
		
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
		
        view.updateNextActions();
		
        console.log(towns[0].totalActionList[1].manaCost())
        document.querySelector("#nextActionsList").style["cssText"] += " overflow: visible!important"
	}
}

setTimeout(() => document.readyState == 'complete' && Predictor.run(), 2000);