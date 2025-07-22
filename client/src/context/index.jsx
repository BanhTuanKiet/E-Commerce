import { UserProvider } from './UserContext'
import { ValideFormProvider } from './ValideForm'

function Index({ children }) {
    return (
        <ValideFormProvider>
            <UserProvider>
                {children}
            </UserProvider>
        </ValideFormProvider>
    )
}

export default Index