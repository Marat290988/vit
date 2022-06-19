import { Injectable, Injector } from "@angular/core";

@Injectable({providedIn: 'root'})
export class InjectService {
    static injector: Injector;

    static getInject() {
        return InjectService.injector;
    }

    static setInject(injector: Injector) {
        InjectService.injector = injector;
    }
}