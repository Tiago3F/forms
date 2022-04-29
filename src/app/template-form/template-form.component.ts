import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent implements OnInit {

  usuario: any = {
    nome: null,
    email: null
  }

  constructor() { }

  ngOnInit(): void {
  }

  verificaValidTouched(campo: { valid: any; touched: any; }) {
    return !campo.valid && campo.touched
  }

  aplicaCssErro(campo: { valid: any; touched: any; }) {
    return {
    'has-error': this.verificaValidTouched(campo),
    'has-feedback': this.verificaValidTouched(campo) }
  }

  onSubmit(form: any){
     console.log(form)
     console.log(this.usuario)
  }

}
