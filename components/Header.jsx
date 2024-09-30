import {AppBar, Box, Toolbar, Typography} from "@mui/material";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import Link from 'next/link'

const Header = () => {

    return (
        <Box sx={{display: 'flex'}}>
            <AppBar position={"static"}>
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{flexGrow: 1, display: {xs: 'none', sm: 'block'}}}
                    >
                        <Link style={{ color: '#FFFFE4'}} href={"/"}>Kickstarter</Link>
                    </Typography>
                    <Typography variant={"h6"} sx={{mr: 2}}>
                        <Link style={{ color: '#FFFFE4'}} href={"/"}>Campaigns</Link>
                    </Typography>
                    <Box sx={{display: {xs: 'none', sm: 'block'}}}>
                        <Link style={{ color: '#FFFFE4'}} href={"/campaigns/new"}>
                            <AddBusinessIcon/>
                        </Link>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Header;