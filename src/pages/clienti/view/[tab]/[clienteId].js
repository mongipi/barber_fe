// ** Third Party Imports
import axios from 'axios'

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL

// ** Demo Components Imports
import UserViewPage from 'src/views/clienti/view/UserViewPage'

const UserView = ({ tab, invoiceData, clienteId }) => {
  return <UserViewPage tab={tab} invoiceData={invoiceData} clienteId={clienteId} />
}

export const getStaticPaths = async () => {
  const response = await axios.get(`${backendURL}/clienti`)

  const paths = response.data.data.map(cliente => ({
    params: { tab: 'account', clienteId: cliente.id }
  }))

  return {
    paths,

    // paths: [
    //   { params: { tab: 'account', clienteId: '1' } },
    //   { params: { tab: 'security', clienteId: '1' } },
    //   { params: { tab: 'billing-plan', clienteId: '1' } },
    //   { params: { tab: 'notification', clienteId: '1' } },
    //   { params: { tab: 'connection', clienteId: '1' } }
    // ],
    fallback: false
  }
}

export const getStaticProps = async ({ params }) => {
  const res = await axios.get('/apps/invoice/invoices')
  const invoiceData = res.data.allData

  return {
    props: {
      invoiceData,
      tab: params?.tab,
      clienteId: params?.clienteId
    }
  }
}

export default UserView
