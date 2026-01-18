{{- define "register-customer.name" -}}
register-customer
{{- end }}

{{- define "register-customer.fullname" -}}
{{ .Release.Name }}-{{ include "register-customer.name" . }}
{{- end }}

{{- define "register-customer.labels" -}}
app.kubernetes.io/name: {{ include "register-customer.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}