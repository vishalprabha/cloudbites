import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";

// Generate Order Data
function createData(id, catagories, name, stars) {
  return { id, catagories, name, stars };
}

const rows = [
  createData(0, "Mexican, American, Tex-Mex", "Texas Roadhouse", "4.89"),
];

function preventDefault(event) {
  event.preventDefault();
}

export default function Recommendations() {
  return (
    <React.Fragment>
      <Title>Recommendations</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Catagoies</TableCell>
            <TableCell>Stars</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.catagories}</TableCell>
              <TableCell>{row.stars}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more reviews
      </Link>
    </React.Fragment>
  );
}
