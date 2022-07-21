import { NgModule } from "@angular/core";
import { PricePipe } from "../pipes/price.pipe";

@NgModule({
    declarations: [
        PricePipe
    ],
    exports: [
        PricePipe
    ]
})
export class PipesModule{};
