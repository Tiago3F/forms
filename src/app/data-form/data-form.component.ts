import { EstadoBr } from './../shared/models/estado-br';
import { DropdownService } from './../shared/service/dropdown.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {

  formulario!: FormGroup;
  estados!: EstadoBr[]

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private dropDownService: DropdownService) { }

  ngOnInit(): void {

    this.estados = [];
    this.dropDownService.getEstadosBr().subscribe((res: EstadoBr) => {
      this.estados.push(res)
      console.log(res)
    })
    // this.formulario = new FormGroup({
    //   nome: new FormControl(null),
    //   email: new FormControl(null)
    // })

    this.formulario = this.formBuilder.group({
      nome: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],

      endereco: this.formBuilder.group({
        cep: [null, Validators.required],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required],
      })
    })
  }

  onSubmit() {
    console.log(this.formulario.value)

    if (this.formulario.valid) {

      this.http.post('https://httpbin.org/post', JSON.stringify(this.formulario.value))
        .pipe(map(dados => dados))
        .subscribe(dados => {
          console.log(dados)
          // Reseta o formulário
          // this.formulario.reset()
          // this.resetar()
        },
          (error: any) => alert('erro'))
    } else {
      // console.log('teste')
      this.verificaValidacoesForm(this.formulario)
    }

  }

  verificaValidacoesForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((campo) => {
      console.log(campo)
      const controle = formGroup.get(campo)
      controle?.markAsDirty()
      if (controle instanceof FormGroup) {
        this.verificaValidacoesForm(controle)
      }
    })
  }

  resetar() {
    this.formulario.reset()
  }

  verificaValidTouched(campo: string) {
    return !this.formulario.get(campo)?.valid && (!!this.formulario.get(campo)?.touched || !!this.formulario.get(campo)?.dirty);
  }

  verificaEmailValido() {
    const campoEmail = this.formulario.get('email')
    if (campoEmail?.errors) {
      return campoEmail?.errors['email'] && campoEmail.touched
    }
  }


  aplicaCssErro(campo: string) {
    return {
      'has-error': this.verificaValidTouched(campo),
      'has-feedback': this.verificaValidTouched(campo)
    }
  }

  consultaCEP() {

    let cep = this.formulario.get('endereco.cep')?.value

    cep = cep.replace(/\D/g, '');

    if (cep != null && cep !== '') {
      const validacep = /^[0-9]{8}$/;

      if (validacep.test(cep)) {

        this.resetaDadosForm()

        this.http.get(`//viacep.com.br/ws/${cep}/json/`)
          .pipe(map((dados: any) => dados))
          .subscribe(dados => this.populaDadosForm(dados));
      }
    }
  }

  populaDadosForm(dados: any) {
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

    this.formulario.patchValue({
      endereco: {
        rua: dados.logradouro,
        cep: dados.cep,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    })

  }

  resetaDadosForm() {
    this.formulario.patchValue({
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
