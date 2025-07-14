import { ValideFormProvider } from './ValideForm'

function Index({ children }) {
    return (
        <ValideFormProvider>
            {children}
        </ValideFormProvider>
    )
}

export default Index