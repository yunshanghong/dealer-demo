import { EventEmitter, Injectable, } from '@angular/core';
import { Subject } from 'rxjs';
import { SearchBarInfo } from '../interfaces/api.model';

@Injectable({ providedIn: 'root' })
export class SearchService {

    constructor() { }

    private searchBarEmitter: Subject<SearchBarInfo> = new Subject()

    onSearch(searchInfo: SearchBarInfo){
        this.searchBarEmitter.next(searchInfo);
    }

    getEmitter(){
        return this.searchBarEmitter;
    }
}
