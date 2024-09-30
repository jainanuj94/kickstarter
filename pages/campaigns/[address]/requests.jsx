import Layout from "../../../components/Layout.jsx";
import {Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import RequestPageIcon from '@mui/icons-material/RequestPage';
import Link from "next/link";
import Campaign from "../../../ethereum/campaign.js";
import RequestRow from "../../../components/RequestRow.jsx";

const ViewRequests = ({contractAddress, requests, approversCount}) => {

    return (
        <Layout>
            <div>
                <h1>View Requests</h1>
                <Link style={{ marginButtom: 10, float: 'right' }} href={`/campaigns/${contractAddress}/requests/new`}>
                    <Button variant={"contained"} endIcon={<RequestPageIcon/>}>Add Request</Button>
                </Link>
                <div>
                    <TableContainer component={Paper}>
                        <Table sx={{minWidth: 650}} aria-label="caption table">
                            <caption>Found {requests.length} request(s)</caption>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Id</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell align="left">Amount (ether)</TableCell>
                                    <TableCell align="left">Recipient</TableCell>
                                    <TableCell align="left">Approval Count</TableCell>
                                    <TableCell align="left">Approve</TableCell>
                                    <TableCell align="left">Finalize</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {requests.map((row, index) => (
                                    <RequestRow
                                             key={index}
                                             index={index}
                                             request={row}
                                             approversCount={approversCount}
                                             contractAddress={contractAddress}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </Layout>
    );
}

ViewRequests.getInitialProps = async (props) => {
    const campaign = await Campaign(props.query.address);
    const numberOfRequests = await campaign.methods.numberOfRequests().call();
    const approversCount = await campaign.methods.approversCount().call();
    const requests = await Promise.all(
        Array(Number(numberOfRequests))
            .fill()
            .map(async (element, index) => {
                const req = await campaign.methods.requests(index).call();
                return {
                    description: req.description,
                    value: Number(req.value),
                    recipient: req.recipient,
                    approvalCount: Number(req.approvalCount),
                    complete: req.complete
                }
            })
    );

    return {
        contractAddress: props?.query?.address,
        requests: requests,
        approversCount: Number(approversCount)
    }
}
export default ViewRequests;