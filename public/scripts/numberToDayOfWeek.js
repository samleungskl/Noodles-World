const numberToDayOfWeek = function (number) {
    let day = '';
    switch (number) {
        case 1:
            day = "Mon";
            break;
        case 2:
            day = "Tue";
            break;
        case 3:
            day = "Wed";
            break;
        case 4:
            day = "Thu";
            break;
        case 5:
            day = "Fri";
            break;
        case 6:
            day = "Sat";
            break;
        case 7:
            day = "Sun";
    }

    return (day)
}

module.exports = { numberToDayOfWeek };