import Layout from "../../../../components/Layout.jsx";
import {Typography} from "@mui/material";
import AddRequest from "../../../../components/AddRequest.jsx";

const NewRequest = ({contractAddress}) => {
    return (
        <Layout>
            <div>
                <Typography sx={{ margin: 2, paddingTop:"20px"}} variant={'h4'}>Create a Request</Typography>
                <div style={{display: "flex", flexDirection: "row"}}>
                    <AddRequest contractAddress={contractAddress}/>
                </div>
            </div>
        </Layout>
    );
}

NewRequest.getInitialProps = async (props) => {
    return {
        contractAddress: props?.query?.address,
    }
}
export default NewRequest;