import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'hideChar' })
export class HideCharPipe implements PipeTransform {
    transform(inputString: string): string {
        return inputString
            ?.split('')
            .map((item, index) => (index > inputString.length - 5 ? '*' : item))
            .join('');
    }
}
