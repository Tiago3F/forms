import { ConsultaCepService } from './../shared/services/consulta-cep.service';
import { EstadoBr } from './../shared/models/estado-br';
import { DropdownService } from '../shared/services/dropdown.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {

  formulario!: FormGroup;
  // estados!: EstadoBr[]
  estados!: Observable<EstadoBr[]>
  cargos!: any[];
  tecnologias!: any[];
  newsletterOp!: any[];

  frameworks = ['Angular', 'React', 'Vue', 'Sencha']


  constructor(private formBuilder: FormBuilder, private http: HttpClient, private dropDownService: DropdownService, private cepService: ConsultaCepService) { }

  ngOnInit(): void {

    this.estados = this.dropDownService.getEstadosBr()

    this.cargos = this.dropDownService.getCargos()

    this.tecnologias = this.dropDownService.getTecnologias()

    this.newsletterOp = this.dropDownService.getNewsletter()

    // this.dropDownService.getEstadosBr().subscribe(dados => {this.estados = dados;  console.log(dados)})

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
      }),

      cargo: [null],
      tecnologias: [null],
      newsletter: ['s'],
      termos: [null, Validators.pattern('true')],
      frameworks: this.buildFrameworks()
    })
  }

  buildFrameworks() {
    const values = this.frameworks.map(v => new FormControl(false))
    return this.formBuilder.array(values)

    //  return [
    //    new FormControl(false),
    //    new FormControl(false),
    //    new FormControl(false),
    //    new FormControl(false),
    //  ]
  }

  getFrameworksControls() {
    return this.formulario.get('frameworks') ? (<FormArray>this.formulario.get('frameworks')).controls : null;
  }

  onSubmit() {
    console.log(this.formulario.value)

    let valueSubmit = Object.assign({}, this.formulario.value)

    valueSubmit = Object.assign(valueSubmit, {
      frameworks: valueSubmit.frameworks
      .map((v: any, i: any) => v ? this.frameworks[i] : null)
      .filter((v: null) => v !== null)
    })

    console.log(valueSubmit)

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

    const cep = this.formulario.get('endereco.cep')?.value

    if (cep != null && cep !== '') {
      this.cepService.consultaCEP(cep)?.subscribe(dados => this.populaDadosForm(dados));
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

  setarCargo() {
    const cargo = {nome: 'Dev', nivel: 'Pleno', desc: 'Dev Pl'};
    this.formulario.get('cargo')?.setValue(cargo)
  }

  compararCargos(obj1: any, obj2: any) {
    return obj1 && obj2 ? (obj1.nome === obj2.nome && obj1.nivel === obj2.nivel) : obj1 === obj2
  }

  setarTecnologias() {
    this.formulario.get('tecnologias')?.setValue(['java', 'javascript', 'php'])
  }

}



