
import TopBar from './ui/TopBar'
import FooterBar from './ui/FooterBar'
import { createMuiTheme, ThemeProvider, makeStyles } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import pink from '@material-ui/core/colors/pink';
import { Box } from '@material-ui/core'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import ClientesForm from './routed/ClientesForm'
import ClientesList from './routed/ClientesList2'


const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: red[500],
        },
        secondary: {
            main: pink[500],
        },
    },
});

const useStyles = makeStyles((theme) => ({
    box: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh',  // 100% da altura da área visível
        paddingBottom: '42px' // Para que o conteúdo não fique escondido atrás do footer
    },
    routed: {
        padding: '25px',
        color: theme.palette.text.primary,
        fontFamily: theme.typography.fontFamily
    }
}));

function Main() {
    const classes = useStyles()
    return (
        <Box className={classes.box}>
            <BrowserRouter>
                <TopBar />
                <Box id="routed" className={classes.routed}>
                    <Switch> 
                        <Route path="/listcliente">
                            <ClientesList />
                        </Route>
                        <Route path="/newcliente">
                            <ClientesForm />
                        </Route>
                        <Route path="/editcliente/:id">
                            <ClientesForm />
                        </Route>
                    </Switch>
                </Box>
                <FooterBar />
            </BrowserRouter>
        </Box >
    )
}

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Main />
        </ThemeProvider>
    );
}

export default App;
