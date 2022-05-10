import { Pipe, PipeTransform } from '@angular/core';
import { Vehicle, VehicleBrand } from '../interfaces/api.model';

@Pipe({ name: 'modelFilter' })
export class ModelFilterPipe implements PipeTransform {

    transform(obj: Array<VehicleBrand>, brandName: string): Array<Vehicle> {
        const result = obj?.find((item) => item.brandName === brandName)?.vehicleModels;
        return result; 
    }
}
