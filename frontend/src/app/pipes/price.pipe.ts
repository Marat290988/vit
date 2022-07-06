import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'price'
})
export class PricePipe implements PipeTransform {
    transform(value: number, symbol: string): string {
        return typeof(value) === 'number' ? `${symbol}${Number(value).toLocaleString('ru')}` : '';
    }

}