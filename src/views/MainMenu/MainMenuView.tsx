import './MainMenu.style.css'
import CreateDBModal from "./CreateDBModal/CreateDBModal";
import {MainMenuViewProps} from "./MainMenuView.types";
import {useNavigate} from "react-router-dom";
import Button from "../../components/Base/Button/Button";


function MainMenuView({mainMenuViewModel}: MainMenuViewProps) {
  const {
    dbs,
    createDbOpenned,
    onCreateDbOpen,
    onCreateDbClose,
    onSubmitDb,
    onDeleteDB
  } = mainMenuViewModel;
  const navigate = useNavigate()

  return (
    <>
      {
        createDbOpenned
          ? <CreateDBModal onSubmitDb={onSubmitDb} onClose={onCreateDbClose}/>
          : null
      }
      <div className="main-menu">
        <h2 className="main-menu__header">Главное меню</h2>
        <div className="main-menu__controls">
          <button onClick={onCreateDbOpen}>Создать БД</button>
          <button>Открыть существующую БД</button>
        </div>
        <div className="main-menu__recent">
          <h3>Прошлые проекты</h3>
          {
            dbs.length
              ?
              <table>
                <thead>
                <tr>
                  <th>Наименование</th>
                  <th>Тип</th>
                  <th>Дата изменения</th>
                </tr>
                </thead>
                <tbody>
                {
                  dbs.map((db) => {
                    return (
                      <tr onClick={() => navigate(`editor/${db.id}`)}>
                        <td className="recent-db__name">{db.name}</td>
                        <td className="recent-db__type">{db.type}</td>
                        <td className="recent-db__create-date">{db?.createDate?.toString()}</td>
                        <td><Button value="-" onClick={(e) => onDeleteDB(e, db.id)}/></td>
                      </tr>
                    )
                  })
                }
                </tbody>
              </table>
              :
              <div className="recent-db__empty">Нет прошлых проектов</div>
          }
        </div>
      </div>
    </>
  )
}

export default MainMenuView