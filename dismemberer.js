function getValue(c) {
    try {
        return JSON.parse(c['value']);
    } catch(err) {
        return null;
    }
}

module.exports = {

    'date': {
        columnSuffixes: ['(date)', '(time)'],
        addColumns: (c, data) => {
            const value = getValue(c);
            data.push(value && value['date']);
            data.push(value && value['time']);
        }
    },

    'duration': {
        columnSuffixes: ['(seconds)'],
        addColumns: (c, data) => {
            const value = getValue(c);
            data.push(value && value['duration']);
        }
    },

    'number': {
        format: (c, text) => {
            let num = parseFloat(text);
            if (isNaN(num)) return text;
            return num.toFixed(6);
        }
    }

}