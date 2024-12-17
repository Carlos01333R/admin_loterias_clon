import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
} from "@nextui-org/react";

import useZonas from "../../../hook/useZona";
import DropdownZona from "./Dropdown";
import Form from "./Form";
import { SearchIcon } from "../../../icons/SearchIcon";
import IconActions from "../../../icons/IconActions";
import IconDescription from "../../../icons/IconDescription";
import IconVscode from "../../../icons/IconVscode";
import { useState } from "react";

export default function TableZona() {
  const { zonas, loading, error } = useZonas();
  const [Filter, setFilter] = useState(null);

  const columns = [
    { name: "NOMBRE", icon: IconDescription },
    { name: "PORCENTAJE LOTERIA", icon: IconVscode },
    { name: "PORCENTAJE CLIENTE", icon: IconActions },
    { name: "PORCENTAJE ADMIN ZONA", icon: IconActions },
    { name: "ACTIONS", icon: IconActions },
  ];

  const filterNameProyect = (zonas) => {
    if (!zonas) return []; // Asegúrate de que user no sea null
    if (Filter === null) return zonas;
    return zonas.filter((zona) =>
      zona.nombre.toLowerCase().includes(Filter.toLowerCase())
    );
  };

  const FilterProject = filterNameProyect(zonas); // Validación adicional para evitar errores

  return (
    <>
      <section className="w-full flex flex-col md:justify-center md:items-center mb-10">
        <div className="w-full flex justify-center items-center">
          {loading && <p>Loading...</p>}
        </div>

        <div className="w-full flex justify-center items-center">
          {error && <p>{error.message}</p>}
        </div>

        {!loading &&
          zonas && ( // Agrega una verificación para que `user` exista
            <>
              <article
                className="w-[90%] md:max-w-[1200px] mx-auto flex justify-end 
             mt-2 mb-2 items-center"
              >
                <Input
                  isClearable
                  className="w-full md:max-w-[30%]"
                  placeholder="Search by name..."
                  startContent={<SearchIcon />}
                  onChange={(e) => setFilter(e.target.value)}
                />
                <Form />
              </article>

              <Table
                style={{
                  backgroundColor: "#13151a",
                }}
                isStriped
                className="text-white rounded-xl w-full md:max-w-[1200px] mx-auto p-0 m-0 "
                aria-label="Example static collection table"
              >
                <TableHeader>
                  {columns.map((col, index) => (
                    <TableColumn
                      style={{
                        backgroundColor: "#13151a",
                      }}
                      className="text-white shadow-2xl border-b-2 border-white rounded-xl"
                      key={index}
                    >
                      <p className="flex items-center gap-2 ">
                        {col.name} {col.icon && <col.icon />}
                      </p>
                    </TableColumn>
                  ))}
                </TableHeader>
                <TableBody>
                  {FilterProject.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.nombre}</TableCell>
                      <TableCell>{row.porcentaje_loteria} </TableCell>
                      <TableCell>{row.porcentaje_cliente}</TableCell>
                      <TableCell>{row.porcentaje_admin_zona}</TableCell>
                      <TableCell>
                        <DropdownZona
                          id={row.id}
                          nombre={row.nombre}
                          porcentaje_loteria={row.porcentaje_loteria}
                          porcentaje_cliente={row.porcentaje_cliente}
                          porcentaje_admin_zona={row.porcentaje_admin_zona}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
      </section>
    </>
  );
}
