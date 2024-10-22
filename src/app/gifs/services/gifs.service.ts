import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponce } from '../interfaces/gifs.interface';

@Injectable({providedIn: 'root'})
export class GifsService {

  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private apiKey:       string = 'VNFfZsyq7006KM41v6kx45PN4SYn68St';
  private serviceURL:   string = 'https://api.giphy.com/v1/gifs';

  constructor( private http: HttpClient ) {
    this.loadLocalStorage();
    console.log('Gifs Service Ready');
  }

  get tagHistory() {
    return [...this._tagsHistory];
  }

  private organizedHistory(tag: string) {
    tag = tag.toLocaleLowerCase();

    if ( this._tagsHistory.includes(tag) ){
      this._tagsHistory = this._tagsHistory.filter( (oldTag) => oldTag !== tag )
    }

    // Coloca la busqueda igual encima
    this._tagsHistory.unshift( tag );

    //Limita la busqueda a 10 elementos
    this._tagsHistory = this._tagsHistory.splice(0,10);

    //Guardar en el Local Storage
    this.saveLocalStorage();
  }

  //Metodo para guardar en el local storage
  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory) );
  }

  //Metodo para recuperar la info del local storage
  private loadLocalStorage(): void {
    if ( !localStorage.getItem( 'history') ) return;
    this._tagsHistory = JSON.parse( localStorage.getItem('history')! );
    this.searchTag(this.tagHistory[0]);
  }

  searchTag(tag: string):void {
    if(tag.length === 0) return;

    this.organizedHistory(tag);

    // fetch('https://api.giphy.com/v1/gifs/search?api_key=yr4HXw1GuZvA13hSmbJg0UrUWNrnAlho&q=valorant&limit=10')
    //   .then( resp => resp.json() )
    //   .then( data => console.log(data) );

    const params = new HttpParams()
      .set('api_key',this.apiKey )
      .set('limit','10')
      .set('q', tag)

    this.http.get<SearchResponce>(`${ this.serviceURL }/search`,{ params })
      .subscribe( resp => {
        this.gifList = resp.data;
      })

  }

}
