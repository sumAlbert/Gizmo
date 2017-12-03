package org;

import javax.servlet.http.HttpSessionBindingEvent;
import javax.servlet.http.HttpSessionBindingListener;
import java.sql.*;

public class DBConnection implements HttpSessionBindingListener{
    Connection conn = null;
    Statement stmt = null;
    ResultSet rs = null;

    public void valueBound(HttpSessionBindingEvent event) {
    }

    public void valueUnbound(HttpSessionBindingEvent event) {
    }

    public DBConnection() {
        this.BuildConnection();
    }

    private void BuildConnection() {
        try{
            Class.forName("com.mysql.jdbc.Driver");
            String URL = "jdbc:mysql://localhost:3306/Gizmo?useUnicode=true&characterEncoding=utf-8&useSSL=false";
            conn = DriverManager.getConnection(URL,"root", "123456");
        } catch(Exception e) {
            System.out.println(e.toString());
        }
    }

    public Statement getStatement() {
        try {
            stmt = conn.createStatement();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return stmt;
    }

}
