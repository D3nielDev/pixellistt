/**
 * Numbers of decimal digits to round to
 */
const scale = 2;

/**
 * Calculate the score awarded when having a certain percentage on a list level
 * @param {Number} rank Position on the list
 * @param {Number} percent Percentage of completion
 * @param {Number} minPercent Minimum percentage required
 * @returns {Number}
 */
export function score(rank, percent, minPercent) {
    if (rank > 150) {
        return 0;
    }

    if (rank > 75 && percent < 100) {
        return 0;
    }

    let baseScore;

    if (rank <= 10) {
        // Linear drop from 300 at #1 to 130 at #10
        baseScore = 300 - (rank - 1) * (170 / 9);
    } else {
        // Gentler decay so Top 25-50 are still worth a good amount
        baseScore = 130 * Math.pow(10 / rank, 0.40);
    }

    let score = baseScore *
        ((percent - (minPercent - 1)) / (100 - (minPercent - 1)));

    score = Math.max(0, score);

    // Non-100% completions receive 2/3 of the score
    if (percent !== 100) {
        return round(score * (2 / 3));
    }

    return round(score);
}

export function round(num) {
    if (!('' + num).includes('e')) {
        return +(Math.round(num + 'e+' + scale) + 'e-' + scale);
    } else {
        const arr = ('' + num).split('e');
        let sig = '';
        if (+arr[1] + scale > 0) {
            sig = '+';
        }
        return +(
            Math.round(+arr[0] + 'e' + sig + (+arr[1] + scale)) +
            'e-' +
            scale
        );
    }
}
