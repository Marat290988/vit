import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class PopupMessageService {
    messageCont: HTMLElement;
    message: HTMLElement;
    stateElement = false;
    refOnCloseMessage = this.closeMessage.bind(null, this);

    constructor() {
        this.messageCont = document.getElementById('message-popup');
        this.message = document.getElementById('message');
        if (this.messageCont && this.message) {
            this.stateElement = true;
            this.messageCont.querySelector('.message-popup-close').addEventListener('click', this.refOnCloseMessage);
        } else {
            console.error('Please make sure app component has elements with id [message-popup] and [message]');
        }
    }

    showMessage(message) {
        if (this.stateElement) {
            this.message.innerText = message;
            this.messageCont.style.display = 'flex';
            setTimeout(()=> {
                this.messageCont.style.background = '#25afa25e';
            });
        }
    }

    closeMessage(parent) {
        parent.messageCont.style.display = '';
        parent.messageCont.style.background = '';
    }
}