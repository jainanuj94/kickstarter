import Header from "./Header.jsx";
import {Container} from "@mui/material";

const Layout = (props) => {
    return (
        <Container>
            <Header/>
            {props.children}
        </Container>
    )
}

export default Layout;