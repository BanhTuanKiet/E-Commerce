import { ChatProvider } from './ChatContext'
import { SearchProvider } from './SearchContext'
import { UserProvider } from './UserContext'
import { ValideFormProvider } from './ValideForm'

function Index({ children }) {
  return (
    <ValideFormProvider>
      <SearchProvider>
        <UserProvider>
          <ChatProvider>
            {children}
          </ChatProvider>
        </UserProvider>
      </SearchProvider>
    </ValideFormProvider>
  )
}

export default Index