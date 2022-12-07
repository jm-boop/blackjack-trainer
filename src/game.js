'use strict';
 
import * as constants from './constants/index.js';
import * as utils from './utils.js';
import { CardDeck, Dealer, Apprentice } from './classes.js';

import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { from } from 'rxjs';

const rl = readline.createInterface({ input, output });

utils.renderInstructions();
play();

async function play() {
    // instantiate user-defined objects with user-defined classes
    const cardDeck = new CardDeck();
    const dealer = new Dealer();
    const apprentice = new Apprentice();
    var chartMove;

    cardDeck.shuffleDeck();
    dealCards(cardDeck, dealer, apprentice);
    utils.renderTable(dealer, apprentice);

    chartMove = lookUpChartMove(dealer.hand, apprentice.hand);
    if (chartMove === 'BLACKJACK') {
        console.log();
        console.log('    BLACKJACK!');
        from(promptPlayAgain()).subscribe( key => {
            play();
        });
    } else {
        from(promptMove()).subscribe(
            move => {
                // flow for pure Basic Strategy practice
                if (chartMove.move === move) {
                    if (chartMove.note) {
                        console.log(`    Correct! ${chartMove.note}`);
                    } else {
                        console.log(`    Correct! ${chartMove.move.slice(0,1).toUpperCase() + chartMove.move.slice(1)}`);
                    }
                } else {
                    if (chartMove.note) {
                        console.log(`    Wrong... ${chartMove.note}`);
                    } else {
                        console.log(`    Wrong... ${chartMove.move.toUpperCase( )}`);
                    }
                }
            },
            err => {
               console.log(err);
                rl.close();
            },
            () => {
                from(promptPlayAgain()).subscribe( key => {
                   play();
                });
            }
        );
    }
}

function dealCards(cardDeck, dealer, apprentice) {
    dealer.getInitialCards(cardDeck.availableCards);
    dealer.renderedHand = utils.fillHandPlaceholders(dealer.hand[0] === '10' ? constants.DEALER_10_HAND : constants.DEALER_HAND, dealer.hand);

    apprentice.getInitialCards(cardDeck.availableCards);
    apprentice.renderedHand = utils.fillHandPlaceholders(apprentice.hand[0] === '10' ? constants.APPRENTICE_10_HAND : constants.APPRENTICE_HAND, apprentice.hand);
}

function lookUpChartMove(dealerHand, apprenticeHand) {
    var chartMove;

    function convertHandValuesToNumbers(arr) {
        for (const i in arr) {
            arr[i] = utils.cardValueToNumber(arr[i]);
        }
        dealerHand[0] = arr[0];
        apprenticeHand[0] = arr[1];
        apprenticeHand[1] = arr[2];
    }

    if (apprenticeHand[0] === apprenticeHand[1]) {
        // pair splitting
        convertHandValuesToNumbers([dealerHand[0], apprenticeHand[0], apprenticeHand[1]]);

        for (const dealerCardValuePS of constants.PAIR_SPLITTING_CHART.values) {
            if (dealerCardValuePS.dealerCard === dealerHand[0]) {
                for (const keyCardValuePS of dealerCardValuePS.values) {
                    if (keyCardValuePS.keyCard === apprenticeHand[0]) {
                        return keyCardValuePS;
                    }
                }
            }
        }
    } else if (apprenticeHand[0] === 'A' || apprenticeHand[1] === 'A') {
        // soft totals
        convertHandValuesToNumbers([dealerHand[0], apprenticeHand[0], apprenticeHand[1]]);
        const apprenticeHandKeyCard = apprenticeHand[0] === 1 ? apprenticeHand[1] : apprenticeHand[0];
        if (apprenticeHandKeyCard === 10) {
            return 'BLACKJACK';
        }

        for (const dealerCardValueST of constants.SOFT_TOTALS_CHART.values) {
            if (dealerCardValueST.dealerCard === dealerHand[0]) {
                for (const keyCardValueST of dealerCardValueST.values) {
                    if (keyCardValueST.keyCard === apprenticeHandKeyCard) {
                        return keyCardValueST;
                    }
                }
            }
        }
    } else {
        // hard totals
        convertHandValuesToNumbers([dealerHand[0], apprenticeHand[0], apprenticeHand[1]]);
        const apprenticeHandHardTotal = apprenticeHand[0] + apprenticeHand[1];

        for (const dealerCardValueHT of constants.HARD_TOTALS_CHART.values) {
            if (dealerCardValueHT.dealerCard === dealerHand[0]) {
                for (const keyCardValueHT of dealerCardValueHT.values) {
                    if (keyCardValueHT.keyCard === apprenticeHandHardTotal) {
                        return keyCardValueHT;
                    }
                }
            }
        }
    }
    return chartMove;
}

// recursive and asynchronous
async function promptMove() { 
    const decision = await rl.question('Move: ');

    switch (decision) {
        case '':
            return 'stand';
        case 'stand':
            return 'stand';
        case 'h':
            return 'hit';
        case 'hit':
            return 'hit';
        case 'd':
            return 'double';
        case 'double':
            return 'double';
        case 's':
            return 'split';
        case 'split':
            return 'split';
        otherwise:
            promptMove();
    }
}

async function promptPlayAgain() {
    const decision = await rl.question('\nPress [Enter] to continue...');
    return decision;
}
