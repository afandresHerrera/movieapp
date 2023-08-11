export const operations = {
    getFixedNumber: (num: number) => {
        const int_part = Math.trunc(num);
        
        return Number((num - int_part).toFixed(2));
    },
    getRatedStar(rating: number) { // value (0 - 10) return (0 - 5)
        const int_part = Math.trunc(rating / 2);
        const fixedNumber = this.getFixedNumber(rating);

        return fixedNumber >= 0.51 ? int_part + 1 : int_part
    }
};