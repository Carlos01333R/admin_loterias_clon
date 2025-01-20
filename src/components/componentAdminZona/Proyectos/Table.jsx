import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Image,
} from "@nextui-org/react";
import useUsers from "../../../hook/users";
import useAdmin from "../../../hook/admin";
import DropdownProyect from "./Dropdown";
import Form from "./Form";
import { SearchIcon } from "../../../icons/SearchIcon";
import IconGit from "../../../icons/IconGit";
import IconActions from "../../../icons/IconActions";
import IconDescription from "../../../icons/IconDescription";
import IconName from "../../../icons/IconName";
import IconPreview from "../../../icons/IconPreviews";
import IconImg from "../../../icons/IconImg";
import IconVscode from "../../../icons/IconVscode";
import { useState, useEffect } from "react";

export default function TableProyect() {
  const [Filter, setFilter] = useState(null);
  const [sector, setSector] = useState(null);

  useEffect(() => {
    // Recuperar el valor de 'userSector' de localStorage cuando se carga el componente
    const storedSector = localStorage.getItem("userSector");
    if (storedSector) {
      setSector(storedSector);
    }
  }, []);

  const { user, loading } = useAdmin({ sector });

  const columns = [
    { name: "ID", icon: IconName },
    { name: "NOMBRE", icon: IconDescription },
    { name: "EMAIL", icon: IconGit },
    { name: "TELEFONO", icon: IconPreview },
    { name: "SECTOR", icon: IconImg },
    { name: "CONSTRASEÑA", icon: IconVscode },
    { name: "ACTIONS", icon: IconActions },
  ];

  const filterNameProyect = (user) => {
    if (!user) return []; // Asegúrate de que user no sea null
    if (Filter === null) return user;
    return user.filter((user) =>
      user.nombre.toLowerCase().includes(Filter.toLowerCase())
    );
  };

  const FilterProject = filterNameProyect(user); // Validación adicional para evitar errores
  console.log(FilterProject);

  return (
    <>
      <section className="w-full flex flex-col md:justify-center md:items-center mb-10">
        <div className="w-full flex justify-center items-center">
          {loading && <p>Loading...</p>}
        </div>

        {!loading &&
          user && ( // Agrega una verificación para que `user` exista
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
                  backgroundColor: "#000000",
                }}
                isStriped
                className="text-white rounded-xl w-full md:max-w-[1200px] mx-auto p-0 m-0 "
                aria-label="Example static collection table"
              >
                <TableHeader>
                  {columns.map((col, index) => (
                    <TableColumn
                      style={{
                        backgroundColor: "#000000",
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
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.nombre}</TableCell>
                      <TableCell>{row.email} </TableCell>
                      <TableCell>{row.telefono}</TableCell>
                      <TableCell>{row.sector}</TableCell>
                      <TableCell>{row.password}</TableCell>
                      <TableCell>
                        <DropdownProyect
                          id={row.id}
                          nombre={row.nombre}
                          email={row.email}
                          telefono={row.telefono}
                          sector={row.sector}
                          password={row.password}
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
