import AreasList from '@/src/components/dashboard/admin-areas/area-list/AreasList';
import { ToastContainer } from 'react-toastify';

export default function page() {

  return (
    <>
      <AreasList /> 
      <ToastContainer />
    </>
  )
}
