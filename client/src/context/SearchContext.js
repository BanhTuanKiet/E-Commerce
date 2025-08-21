import axios from "../util/AxiosConfig"
import { useEffect } from "react"
import { createContext, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { warning } from "../util/NotifyUtil"

const SearchContext = createContext()

const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState()
  const productsRef = useRef(null)
  const navigate = useNavigate()
  const [productsCompare, setProductsCompare] = useState([])

  const handleSearch = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.get(`/products/search?searchTerm=${searchTerm.trim()}`)
      setProducts(response.data)
    } catch (error) {
      console.log(error)
    }

    // if (searchTerm.trim()) {
    //   navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
    // }
  }

  const handleCompareProducts = (product) => {
    if (productsCompare.length > 0 && productsCompare[0].category !== product.category) return warning("Only compare products in the same category")
    if (productsCompare.length > 2) return warning("Only up to 3 products can be compared")
    if (productsCompare.some(p => p._id === product._id)) return warning("Product already in comparison list")
    setProductsCompare(prev => [...prev, product])
  }

  return (
    <SearchContext.Provider value={{ products, setProducts, searchTerm, setSearchTerm, handleSearch, productsCompare, setProductsCompare, handleCompareProducts }}>
      {children}
    </SearchContext.Provider>
  )
}

export { SearchContext, SearchProvider }