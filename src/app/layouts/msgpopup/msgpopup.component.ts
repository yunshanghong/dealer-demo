import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MsgPupup } from 'src/app/interfaces/common.model';

@Component({
	selector: 'app-msgPopup',
	templateUrl: './msgPopup.component.html',
	styleUrls: []
})
export class MsgPopupComponent{
    @Input() showPopInfo: MsgPupup = {
        timer: null,
        popmsg: null,
        successFunc: null
    };

    onClearSaveTimer(){
        clearTimeout(this.showPopInfo.timer);
        this.showPopInfo = { ...this.showPopInfo, timer: null };
        this.showPopInfo?.successFunc && this.showPopInfo.successFunc();
    }
}
