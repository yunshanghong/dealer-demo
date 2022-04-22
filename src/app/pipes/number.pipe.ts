import { Pipe, PipeTransform } from '@angular/core';
import { Vehicle, VehicleBrand } from '../interfaces/api.model';

@Pipe({ name: 'numberComa' })
export class NumberComaFilterPipe implements PipeTransform {

    transform(obj: string): string {
        console.log(obj)
        if(!obj || !obj.toString().match(/^[\d,.]*$/))
            return obj;
        
        const splitObj = obj.toString().split(".");
        const numberBeforeComma = parseInt(splitObj[0].split(",").join("")).toLocaleString()
        const result = splitObj[1] !== undefined ? `${numberBeforeComma}.${splitObj[1]}` : `${numberBeforeComma}`;
        return result ; 
    }
}
