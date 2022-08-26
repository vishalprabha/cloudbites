import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";

// Generate Order Data
function createData(id, categories, name, stars) {
  return { id, categories, name, stars };
}

function preventDefault(event) {
  event.preventDefault();
}

const Recommendations = ({data}) => {
  let rows = []
  if(data == null){
    rows = [
      createData(0, "Mexican, American, Tex-Mex", "Texas Roadhouse", "4.89"),
    ];
  }
  else{
    rows = data.recommendations
  }
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
              <TableCell>{row.categories}</TableCell>
              <TableCell>{row.stars}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}

export default Recommendations;