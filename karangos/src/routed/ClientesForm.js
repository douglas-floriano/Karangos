import { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import InputMask from 'react-input-mask'
import InputAdornment from '@material-ui/core/InputAdornment'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useHistory, useParams } from 'react-router-dom'
import ConfirmDialog from '../ui/ConfirmDialog'


const useStyles = makeStyles(() => ({
    form: {
        maxWidth: '80%',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        '& .MuiFormControl-root': {
            minWidth: '200px',
            maxWidth: '500px',
            marginBottom: '24px',
        }
    },
    toolbar: {
        marginTop: '36px',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-around'
    },
    // checkbox: {
    //     alignItems: 'center'
    // }
}))
const formatChars = {
    'A': '[A-Za-z]',
    '0': '[0-9]',
    '#': '[0-9A-Ja-j]',
    'B': '[9]'
}

const cpfMask = '000.000.000-00'
const rgMask = '00.000.000 AAA/AA'
const telefoneMask = '(00) B0000-0000'

export default function ClientesForm() {
    const classes = useStyles()

    const [clientes, setClientes] = useState({
        id: null,
        nome: '',
        cpf: '',
        rg: '',
        logradouro: '',
        num_imovel: '',
        complemento: '',
        bairro: '',
        municipio: '',
        uf: '',
        telefone: '',
        email: ''
    })
    const [currentId, setCurrentId] = useState()

    const [snackState, setSnackState] = useState({
        open: false,
        severity: 'success',
        message: 'Cliente salvo com sucesso'
    })

    const [btnSendState, setBtnSendState] = useState({
        disabled: false,
        label: 'Enviar'
    })

    const [error, setError] = useState({
        nome: '',
        cpf: '',
        rg: '',
        logradouro: '',
        num_imovel: '',
        bairro: '',
        municipio: '',
        uf: '',
        telefone: '',
        email: ''
    })

    const [isModified, setIsModified] = useState(false)

    const [dialogOpen, setDialogOpen] = useState(false)

    const [title, setTitle] = useState("Cadastrar Novo Cliente")

    const history = useHistory()
    const params = useParams()

    useEffect(() => {
        //Verficar se possui parâmetro id na rota
        if (params.id){
            setTitle('Editando o Cliente')
        getData(params.id)
        }
    }, [])

    async function getData(id) {
        try {
            let response = await axios.get(`https://api.faustocintra.com.br/clientes/${id}`)

            setClientes(response.data)
        }
        catch (error) {
            setSnackState({
                open: true,
                saverity: 'error',
                message: 'Não foi possível carregar dados para edição'

            })
        }
    }

    function handleInputChange(event, property) {
        const ClientesTemp = { ...clientes }


        // Se houver id no event.target, ele será o nome da propriedade
        // senão, usaremos o valor do segundo parâmetro
        if (event.target.id) property = event.target.id

        if (property === 'cpf') {
            ClientesTemp[property] = event.target.value
        }
        else if (property === 'rg') {
            ClientesTemp[property] = event.target.value.toUpperCase()

        } else if (property === 'telefone') {
            ClientesTemp[property] = event.target.value.toUpperCase()
        }
        else {
            // Quando o nome de uma propriedade de um objeto aparece entre [],
            // isso se chama "propriedade calculada". O nome da propriedade vai
            // corresponder à avaliação da expressão entre os colchetes
            //setCurrentId(event.target.id)
            //setClientes({ ...clientes, [property]: event.target.value })
            ClientesTemp[property] = event.target.value
        }
        setClientes(ClientesTemp)
        setIsModified(true)
        validade(ClientesTemp) //Dispara a validação
    }

    function validade(data) {
        const errorTemp = {
            nome: '',
            cpf: '',
            rg: '',
            logradouro: '',
            num_imovel: '',
            bairro: '',
            municipio: '',
            uf: '',
            telefone: '',
            email: ''
        }
        let isValid = true

        // trim(): retira os espaços em branco do iníceio e do final de uma String
        //Validação do campo nome
        if (data.nome.trim() === '') {
            errorTemp.marca = 'O nome deve ser preenchido'
            isValid = false
        }

        //Validação do campo CPF
        if (isNaN(data.cpf)=== ''|| data.cpf.includes('_')) {
            errorTemp.cpf = 'O CPF deve ser preenchido corretamente'
            isValid = false
        }
        //Validação do campo RG
        if (data.rg.trim() === '') {
            errorTemp.rg = 'O RG deve ser preenchido corretamente'
            isValid = false
        }
        //Validação do campo Logradouro
        if (data.logradouro.trim() === '') {
            errorTemp.logradouro = 'O Logradouro deve ser preenchido'
            isValid = false
        }
        //Validação do campo número do imóvel
        if (isNaN(data.num_imovel) || Number(data.num_imovel) <=0) {
            errorTemp.num_imovel = 'O número do imóvel deve ser preenchido'
            isValid = false
        }
        //Validação do campo Bairro
        if (data.bairro=== '') {
            errorTemp.bairro = 'O Bairro deve ser preenchido'
            isValid = false
        }
        //Validação do campo Município
        if (data.municipio === '') {
            errorTemp.municipio = 'Seu Município deve ser preenchido'
            isValid = false
        }
        //Validação do campo Estado
        if (data.uf === '') {
            errorTemp.uf = 'O seu Estado deve ser preenchido'
            isValid = false
        }
        //Validação do campo Telefone
        if (data.telefone === '') {
            errorTemp.telefone = 'O seu Telefone deve ser preenchido corretamente'
            isValid = false
        }
        if (data.email === '') {
            errorTemp.email = 'O seu Email deve ser preenchido'
            isValid = false
        }
        setError(errorTemp)
        return isValid

    }



    async function saveData() {
        try {
            //Desabilitar o botão de Enviar
            setBtnSendState({ disabled: true, label: 'Enviando...' })

            //PUT é para se já existe o parêmetro ID
            if (params.id) await axios.put(`https://api.faustocintra.com.br/clientes/${params.id}`, clientes)

            // Registro não existem, ele criara através do método POST
            await axios.post('https://api.faustocintra.com.br/clientes', clientes)

            setSnackState({
                open: true,
                severity: 'success',
                message: 'Cliente salvo com sucesso!'
            })

        }
        catch (error) {
            setSnackState({
                open: true,
                severity: 'error',
                message: 'ERRO' + error.message
            })
        }
        //Reabilitar o botão de enviar
        setBtnSendState({ disabled: false, label: 'Enviar' })
    }

    function handleSubmit(event) {

        event.preventDefault() // Evita o recarregamento da página

        if (validade(clientes)) saveData()
        else Alert('Preencha os')
    }

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    function handleSnackClose(event, reason) {
        if (reason === 'clickaway') return
        setSnackState({ ...snackState, open: false })

        //Retorna a página de listagem
        history.push('/listcliente')

    }


    function handleDialogClose(result) {
        setDialogOpen(false)

        //Se ousuário concordou em voltar
        if (result) history.push('/listcliente')
    }

    function handleGoBack() {
        if (isModified) setDialogOpen(true)

        else history.push('/listcliente')
    }

    return (
        <>
            <ConfirmDialog isOpen={dialogOpen} onClose={handleDialogClose}>
                Dados não salvos, deseja realmente voltar?
            </ConfirmDialog>

            <Snackbar open={snackState.open} autoHideDuration={3000} onClose={handleSnackClose}>
                <Alert onClose={handleSnackClose} severity={snackState.severity}>
                    {snackState.message}
                </Alert>
            </Snackbar>

            <h1>{title}</h1>
            <form className={classes.form} onSubmit={handleSubmit}>
                <TextField id="nome"
                    label="Nome"
                    variant="filled"
                    value={clientes.nome}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    error={error.nome !== ''}
                    helperText={error.nome}
                />

                <InputMask
                    formatChars={formatChars}
                    mask={cpfMask}
                    fullWidth
                    id="cpf"
                    onChange={event => handleInputChange(event, 'cpf')}
                    value={clientes.cpf}
                >
                    {() => <TextField label="Cpf"
                        variant="filled"
                        fullWidth
                        required
                        error={error.cpf !== ''}
                        helperText={error.cpf}
                    />}
                </InputMask>

                <InputMask
                    formatChars={formatChars}
                    mask={rgMask}
                    fullWidth
                    id="rg"
                    onChange={event => handleInputChange(event, 'rg')}
                    value={clientes.rg}
                >
                    {() => <TextField label="RG"
                        variant="filled"
                        fullWidth
                        required
                        error={error.rg !== ''}
                        helperText={error.rg}
                    />}
                </InputMask>
                <TextField id="logradouro"
                    label="Logradouro"
                    variant="filled"
                    value={clientes.logradouro}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    error={error.logradouro !== ''}
                    helperText={error.logradouro}
                />
                <TextField id="num_imovel"
                    label="Número imovel"
                    variant="filled"
                    value={clientes.num_imovel}
                    type="number"
                    onChange={handleInputChange}
                    fullWidth
                    required
                    error={error.num_imovel !== ''}
                    helperText={error.num_imovel}
                />
                <TextField id="complemento" label="Complemento" variant="filled" value={clientes.complemento} onChange={handleInputChange} fullWidth />
                <TextField id="bairro"
                    label="Bairro"
                    variant="filled"
                    value={clientes.bairro}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    error={error.bairro !== ''}
                    helperText={error.bairro}
                />
                <TextField id="municipio"
                    label="municipio"
                    variant="filled"
                    value={clientes.municipio}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    error={error.municipio !== ''}
                    helperText={error.municipio}
                />
                <TextField id="uf"
                    label="Estado"
                    variant="filled"
                    value={clientes.uf}
                    onChange={event => handleInputChange(event, 'uf')} select
                    fullWidth
                    required
                    error={error.uf !== ''}
                    helperText={error.uf}>
                    <MenuItem value="AC">Acre</MenuItem>
                    <MenuItem value="AL">Alagoas</MenuItem>
                    <MenuItem value="AP">Amapá</MenuItem>
                    <MenuItem value="AM">Amazonas</MenuItem>
                    <MenuItem value="BA">Bahia</MenuItem>
                    <MenuItem value="CE">Ceará</MenuItem>
                    <MenuItem value="DF">Distrito Federal</MenuItem>
                    <MenuItem value="ES">Espírito Santo</MenuItem>
                    <MenuItem value="GO">Goiás</MenuItem>
                    <MenuItem value="MA">Maranhão</MenuItem>
                    <MenuItem value="MT">Mato Grosso</MenuItem>
                    <MenuItem value="MS">Mato Grosso do Sul</MenuItem>
                    <MenuItem value="MG"> Minas Gerais</MenuItem>
                    <MenuItem value="PA">Pará</MenuItem>
                    <MenuItem value="PB">Paraíba</MenuItem>
                    <MenuItem value="PR">Paraná</MenuItem>
                    <MenuItem value="PE">Pernambuco</MenuItem>
                    <MenuItem value="PI">Piauí</MenuItem>
                    <MenuItem value="RJ">Rio de Janeiro</MenuItem>
                    <MenuItem value="RN">Rio Grande do Norte</MenuItem>
                    <MenuItem value="RS">Rio Grande do Sul</MenuItem>
                    <MenuItem value="RO">Rondônia</MenuItem>
                    <MenuItem value="RR">Roraima</MenuItem>
                    <MenuItem value="SC">Santa Catarina</MenuItem>
                    <MenuItem value="SP">São Paulo</MenuItem>
                    <MenuItem value="SE">Sergipe</MenuItem>
                    <MenuItem value="TO">Tocantins</MenuItem>
                </TextField>
                <InputMask
                    formatChars={formatChars}
                    mask={telefoneMask}
                    fullWidth
                    id="telefone"
                    onChange={event => handleInputChange(event, 'telefone')}
                    value={clientes.telefone}
                >
                    {() => <TextField label="Telefone"
                        variant="filled"
                        fullWidth
                        required
                        error={error.telefone !== ''}
                        helperText={error.telefone}
                    />}
                </InputMask>
                <TextField id="email"
                    label="Email"
                    variant="filled"
                    value={clientes.email}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    error={error.email !== ''}
                    helperText={error.email}
                />
                <Toolbar className={classes.toolbar} >
                    <Button variant="contained"
                        color="secondary"
                        type="submit"
                        disabled={btnSendState.disabled}
                    >
                        {btnSendState.label}
                    </Button>
                    <Button variant="contained" onClick={handleGoBack}>Voltar</Button>
                </Toolbar>

                {/* <div>{JSON.stringify(clientes)}</div> */}
            </form>
        </>
    )
}