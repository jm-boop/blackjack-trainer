// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export function fisherYatesShuffle(arr) {
    let currentIndex = arr.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [arr[currentIndex], arr[randomIndex]] = [
        arr[randomIndex], arr[currentIndex]];
    }

    return arr;
}

export function fillHandPlaceholders(str, arr) {
    const arrCopy = arr;

    if (!str.includes('r')) {
        return str; 
    } else {
        return fillHandPlaceholders(str.replace(arrCopy[0] === '10' ? 'r ': 'r', arrCopy[0]), arrCopy.slice(1));
    }
}

export function cardValueToNumber(str) {
    if (str === 'A') {
        return 1;
    } else if ( str === '10' || str === 'J' || str === 'Q' || str === 'K' ) {
        return 10;
    }
    return parseInt(str);
}

// console log utility functions
export function renderInstructions() {
    console.log('\n');
    console.log('            BLACKJACK');
    console.log('            BASIC STRATEGY TRAINER');
    console.log('                            v0.1.0');
    console.log('\n');
    console.log('    to:');
    console.log('        Stand......... [Enter] or type \'stand\'');
    console.log('        Hit........... [h] or type \'hit\'');
    console.log('        Split......... [s] or type \'split\'');
    console.log('        Double-down... [d] or type \'double\'');
}

export function renderTable(dealer, apprentice) {
    console.log('\n');
    console.log(dealer.renderedHand);
    console.log('       ___________')
    // console.log();
    // console.log('__   ___($)____   ___   __');
    console.log(apprentice.renderedHand);
    console.log();
}
