import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'price'
})
export class PricePipe implements PipeTransform {
    transform(value: any, symbol: string): string {
        let ednNum;
        const match = String(value).match(/\.\d\d?/)
        if (match) {
            if (match[0].length === 2) {
                ednNum = match[0] + '0';
            } else if (match[0].length === 3) {
                ednNum = match[0];
            }
        } else {
            ednNum = '.00'
        }
        return typeof(value) === 'number' ? `${symbol}${Number(Math.trunc(value)).toLocaleString('ru')}${ednNum}` : '';
    }

}