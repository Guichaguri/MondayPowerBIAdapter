function getValue(c) {
    try {
        return JSON.parse(c['value']);
    } catch(err) {
        return null;
    }
}

module.exports = {

    'date': {
        column_suffixes: ['(date)', '(time)'],
        process: (c, data) => {
            const value = getValue(c);
            data.push(value && value['date']);
            data.push(value && value['time']);
        }
    },

    'duration': {
        column_suffixes: ['(seconds)'],
        process: (c, data) => {
            const value = getValue(c);
            data.push(value && value['duration']);
        }
    }

}