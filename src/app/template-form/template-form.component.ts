import { ConsultaCepService } from './../shared/services/consulta-cep.service';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient, private cepService: ConsultaCepService) { }

  ngOnInit(): void {
  }

  verificaValidTouched(campo: { valid: any; touched: any; }) {
    return !campo.valid && campo.touched
  }

  aplicaCssErro(campo: { valid: any; touched: any; }) {
    return {
      'has-error': this.verificaValidTouched(campo),
      'has-feedback': this.verificaValidTouched(campo)
    }
  }

  onSubmit(formulario: any) {
    console.log(formulario)
    // console.log(this.usuario)
    this.http.post('https://httpbin.org/post', JSON.stringify(formulario.value))
      .pipe(map(dados => dados))
      .subscribe(dados => {
        console.log(dados)
        formulario.form.reset()
      })
  }

  consultaCEP(cep: any, form: any) {
    cep = cep.replace(/\D/g, '');

    if (cep != null && cep !== '') {
      this.cepService.consultaCEP(cep)?.subscribe(dados => this.populaDadosForm(dados, form));
    }

  }

  populaDadosForm(dados: any, formulario: any) {
    // formulario.setValue({
    //   nome: formulario.value.nome,
    //   email: formulario.value.email,
    //   endereco: {
    //     rua: dados.logradouro,
    //     cep: dados.cep,
    //     numero: '',
    //     complemento: dados.complemento,
    //     bairro: dados.bairro,
    //     cidade: dados.localidade,
    //     estado: dados.uf
    //   }
    // })

    formulario.form.patchValue({
      endereco: {
        rua: dados.logradouro,
        cep: dados.cep,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    })

    console.log(formulario)

  }


  resetaDadosForm(formulario: any) {
    formulario.form.patchValue({
      endereco: {
        rua: null,
        cep: null,
        complemento: null,
        bairro: null,
        cidade: null,
        estado: null
      }
    })
  }
}

