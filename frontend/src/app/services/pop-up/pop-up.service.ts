import { Injectable, ComponentRef } from "@angular/core";
import { BehaviorSubject, skip } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PopupService {

    subject = new BehaviorSubject<any>(null);
    subjectLogin = new BehaviorSubject<boolean>(false);
    errorMessage = '';
    
    showComponent(component) {
        this.subject.next({component: component, state: false});
    }

    confirm() {
        this.subject.next({component: null, state: true});
    }

    cancel() {
        this.subject.next({component: null, state: false});
    }
}