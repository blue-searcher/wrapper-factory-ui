import Topbar from './Topbar'
import Footer from './Footer'
import { ToastContainer } from 'react-toastify'

interface Props {
  title: string,
  description: string,
  children: JSX.Element,
}

export default function ContentWrapper({
  title,
  description,
  children
}: Props) {
  const style = {
    heading: {
      marginTop: 50,
    },
    content: {
      marginTop: 5,
    },
  };

  return (
    <div>
      <Topbar />
      
      <div className="container text-center" style={style.heading}>
        <h3 className="text-uppercase">{title}</h3>
        <span className="text-muted">{description}</span>
      </div>

      <div className="container" style={style.content}>
        {children}
      </div>

      <Footer />

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  )
}
