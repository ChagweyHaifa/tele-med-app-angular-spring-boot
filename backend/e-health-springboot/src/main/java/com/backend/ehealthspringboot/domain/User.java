package com.backend.ehealthspringboot.domain;
import javax.persistence.*;

import com.backend.ehealthspringboot.enumeration.Gender;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Data
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type", discriminatorType = DiscriminatorType.STRING)
@Table(name="medix_users")
public class User  {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
//  @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
  @Column(name="id")
  private Long id;

  @Column(name="user_id")
  private String userId;

  @Column(name="first_name")
  private String firstName;

  @Column(name="last_name")
  private String lastName;

  @Column(name="username")
  private String username;

  @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
  @Column(name="password")
  private String password;

  @Column(name="email")
  private String email;

//  ******* address relationship *******
  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "address", referencedColumnName = "id")
  private Address address;

  @Column(name="phone_number")
  private String phoneNumber;

  @Column(name="gender")
  private String gender;

  @Column(name="last_login_date")
  private Date lastLoginDate;

  @Column(name="last_login_date_display")
  private Date lastLoginDateDisplay;

  @Column(name="join_date")
  private Date joinDate;

  @Column(name="role")
  private String role; //ROLE_USER{ read, edit }, ROLE_ADMIN {delete}

  @Column(name="authorities")
  private String[] authorities;

  @Column(name="is_active")
  private boolean isActive;

  @Column(name="is_not_locked")
  private boolean isNotLocked;

  @JsonIgnore
  @OneToMany(mappedBy = "user")
  Set<Question> questions;

  @JsonIgnore
  @OneToMany(mappedBy = "user")
  List<DoctorRating> ratings;
}
