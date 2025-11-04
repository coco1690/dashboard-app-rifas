import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '@/supabase/client'
import { CustomTitle } from '@/components/custom/CustomTitle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

import { 
  Search, 
  UserPlus, 
  User, 
  Loader2,
  AlertCircle,
  Users,
} from 'lucide-react'
import { useUserListStore } from '@/stores/userListStore'
import { BuscarClienteCard } from './components/BuscarClienteCard'

type ClienteFound = {
  user_id: string
  direccion: string
  ciudad: string
  agencia_id: string | null
  user: {
    id: string
    documento_identidad: string
    nombre: string
    email: string
    phone: string
    user_type: string
  }
}

export const AdminClientesPage = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [cliente, setCliente] = useState<ClienteFound | null>(null)
  const [searched, setSearched] = useState(false)
  const [totalClientes, setTotalClientes] = useState(0)

  const { searchCliente, loading, error: storeError } = useUserListStore()

  // Cargar total de clientes al montar
  useEffect(() => {
    const fetchTotal = async () => {
      const { count } = await supabase
        .from('clientes')
        .select('*', { count: 'exact', head: true })
      
      if (count !== null) {
        setTotalClientes(count)
      }
    }
    fetchTotal()
  }, [])

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      return
    }

    setSearched(true)
    setCliente(null)

    const result = await searchCliente(searchTerm)
    
    if (result) {
      setCliente(result as ClienteFound)
    }
  }

  const handleViewCliente = () => {
    if (cliente) {
      navigate(`/admin/admin_clientes/${cliente.user_id}`)
    }
  }

  const handleCreateCliente = () => {
    navigate('/admin/admin_clientes/new')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CustomTitle
          title="Gestión de Clientes"
          emoji="👥"
          subtitle="Administra todos los clientes del sistema"
        />
        <Button onClick={handleCreateCliente} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Crear Cliente
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Clientes
                </p>
                <p className="text-2xl font-bold">{totalClientes}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        {/* <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Clientes con Agencia
                </p>
                <p className="text-2xl font-bold">-</p>
              </div>
              <Building2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Sin Agencia
                </p>
                <p className="text-2xl font-bold">-</p>
              </div>
              <Users className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Buscador */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email o documento..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setSearched(false)
                }}
                onKeyPress={handleKeyPress}
                className="pl-10"
                disabled={loading}
              />
            </div>
            <Button onClick={handleSearch} disabled={loading || !searchTerm.trim()}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {storeError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{storeError}</AlertDescription>
        </Alert>
      )}

      {/* ← COMPONENTE HIJO: Card con resultado del cliente encontrado */}
      {cliente && (
        <BuscarClienteCard 
          cliente={cliente} 
          onViewDetails={handleViewCliente}
        />
      )}

      {/* Estado: No encontrado */}
      {searched && !cliente && !loading && storeError && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 text-muted-foreground">
              <User className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No se encontró ningún cliente</h3>
              <p className="text-sm">
                Intenta buscar por documento, email o nombre
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estado inicial: Sin búsqueda */}
      {!searched && !cliente && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 text-muted-foreground">
              <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Busca un cliente</h3>
              <p className="text-sm">
                Ingresa el documento, email o nombre del cliente que deseas encontrar
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}