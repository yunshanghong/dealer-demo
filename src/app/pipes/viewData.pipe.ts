import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'DateTime' })
export class DateTimePipe implements PipeTransform {

    transform(obj: Date): string {
        return moment(obj).format("MM/DD/YYYY");
    }
}
